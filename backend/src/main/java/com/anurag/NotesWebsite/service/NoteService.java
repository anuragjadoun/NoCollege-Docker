package com.anurag.NotesWebsite.service;

import com.anurag.NotesWebsite.dto.DownloadResponse;
import com.anurag.NotesWebsite.entity.*;
import com.anurag.NotesWebsite.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.anurag.NotesWebsite.repository.LikeRepository;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private DownloadRepository downloadRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;


    @Autowired
    private NotificationClientService notificationClientService;

    @Autowired
    private NotificationService notificationService;



    public List<Note> getMyNotes(String email) {
        return noteRepository.findByUserEmail(email);
    }

    // Create Note
    public Note createNote(Note note){
        note.setCreatedAt(LocalDateTime.now());
        return noteRepository.save(note);
    }

    // Get All Notes (GLOBAL FEED )
    public List<Note> getAllNotes(){
        return noteRepository.findAll();
    }

    // Get Note by ID
    public Optional<Note> getNoteById(Long id){
        return noteRepository.findById(id);
    }

    // Delete Note
    public void deleteNote(Long id){
        noteRepository.deleteById(id);
    }

    // Search Notes
    public List<Note> searchNotes(String keyword){
        return noteRepository
                .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

    // GET USER (NEW)
    public Optional<User> getUserByEmail(String email){
        return userRepository.findByEmail(email);
    }

    // Save download
    public void saveDownload(String email, Long noteId){
        Download download = new Download();
        download.setUserEmail(email);
        download.setNoteId(noteId);
        download.setDownloadedAt(LocalDateTime.now());

        downloadRepository.save(download);
    }

    // Download history
    public List<DownloadResponse> getDownloadsByUser(String email) {

        List<Download> downloads = downloadRepository.findByUserEmail(email);

        return downloads.stream().map(d -> {

                    Note note = noteRepository.findById(d.getNoteId()).orElse(null);

                    if (note == null) {
                        return null;
                    }

                    DownloadResponse res = new DownloadResponse();

                    res.setId(d.getId()); // MOST IMPORTANT FIX
                    res.setTitle(note.getTitle());
                    res.setFilePath(note.getFilePath());
                    res.setDownloadedAt(d.getDownloadedAt());

                    return res;

                }).filter(java.util.Objects::nonNull)
                .toList();
    }



    // toggle like
    public boolean toggleLike(String email, Long noteId) {

        Optional<Like> existing =
                likeRepository.findByUserEmailAndNoteId(email, noteId);

        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            return false; // unliked
        } else {
            Like like = new Like();
            like.setUserEmail(email);
            like.setNoteId(noteId);
            likeRepository.save(like);

            Note note = noteRepository.findById(noteId)
                    .orElseThrow(() ->
                            new RuntimeException("Note not found")
                    );

            String ownerEmail = note.getUser().getEmail();

            // DON'T SEND EMAIL TO SELF
            if (!ownerEmail.equals(email)) {

                notificationClientService.sendEmail(
                        ownerEmail,
                        "Someone liked your note ❤️",
                        "User " + email +
                                " liked your note:\n\n" +
                                note.getTitle() +
                                "\n\nOpen NoCollege to check it out 🚀"
                );

                notificationService.createNotification(
                        ownerEmail,
                        email + " liked your note: " +
                                note.getTitle()
                );
            }
            return true; // liked
        }
    }

    // get like count
    public long getLikeCount(Long noteId) {
        return likeRepository.countByNoteId(noteId);
    }





    // Save comment
    public void addComment(String email, Long noteId, String text) {
        Comment c = new Comment();
        c.setUserEmail(email);
        c.setNoteId(noteId);
        c.setText(text);
        c.setCreatedAt(LocalDateTime.now());

        commentRepository.save(c);

        Note note = noteRepository.findById(noteId)
                .orElseThrow(() ->
                        new RuntimeException("Note not found")
                );

        String ownerEmail = note.getUser().getEmail();

// DON'T SEND EMAIL TO SELF
        if (!ownerEmail.equals(email)) {

            notificationClientService.sendEmail(
                    ownerEmail,
                    "New comment on your note 💬",
                    "User " + email +
                            " commented on your note:\n\n" +
                            note.getTitle() +
                            "\n\nComment:\n" +
                            text +
                            "\n\nOpen NoCollege to reply 🚀"
            );

            notificationService.createNotification(
                    ownerEmail,
                    email + " commented on your note: "
                            + note.getTitle()
            );
        }
    }


    // Get comments
    public List<Comment> getComments(Long noteId) {
        return commentRepository.findByNoteId(noteId);
    }




    public void saveFeedback(String email, String message) {
        Feedback fb = new Feedback();
        fb.setUserEmail(email);
        fb.setMessage(message);
        fb.setCreatedAt(java.time.LocalDateTime.now());

        feedbackRepository.save(fb);
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    // DELETE COMMENT

    public void deleteComment(
            Long commentId,
            String email
    ) {

        Comment comment =
                commentRepository.findById(commentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Comment not found ❌"
                                )
                        );

        // OWNER CHECK

        if (!comment.getUserEmail().equals(email)) {

            throw new RuntimeException(
                    "You can delete only your own comments ❌"
            );
        }

        commentRepository.delete(comment);
    }

    // EDIT COMMENT

    public void editComment(
            Long commentId,
            String email,
            String newText
    ) {

        Comment comment =
                commentRepository.findById(commentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Comment not found ❌"
                                )
                        );

        // OWNER CHECK

        if (!comment.getUserEmail().equals(email)) {

            throw new RuntimeException(
                    "You can edit only your own comments ❌"
            );
        }

        comment.setText(newText);

        commentRepository.save(comment);
    }


    public List<Note> getTrendingNotes() {

        List<Long> trendingIds =
                likeRepository
                        .findTrendingNoteIds();

        if (trendingIds.isEmpty()) {

            return List.of();
        }

        return noteRepository
                .findTop10ByIdIn(
                        trendingIds
                )
                .stream()
                .limit(5)
                .toList();
    }
}