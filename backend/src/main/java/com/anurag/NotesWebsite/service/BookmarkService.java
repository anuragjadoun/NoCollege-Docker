package com.anurag.NotesWebsite.service;

import com.anurag.NotesWebsite.entity.Bookmark;
import com.anurag.NotesWebsite.repository.BookmarkRepository;

import com.anurag.NotesWebsite.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.anurag.NotesWebsite.entity.Note;

@Service
public class BookmarkService {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private NoteRepository noteRepository;

    // TOGGLE BOOKMARK
    public boolean toggleBookmark(
            String email,
            Long noteId
    ) {

        Optional<Bookmark> existing =
                bookmarkRepository
                        .findByUserEmailAndNoteId(
                                email,
                                noteId
                        );

        // REMOVE BOOKMARK
        if (existing.isPresent()) {

            bookmarkRepository.delete(
                    existing.get()
            );

            return false;
        }

        // ADD BOOKMARK
        Bookmark bookmark = new Bookmark();

        bookmark.setUserEmail(email);

        bookmark.setNoteId(noteId);

        bookmark.setCreatedAt(
                LocalDateTime.now()
        );

        bookmarkRepository.save(bookmark);

        return true;
    }

    // GET USER BOOKMARKS
    public List<Note> getUserBookmarks(
            String email
    ) {

        List<Bookmark> bookmarks =
                bookmarkRepository
                        .findByUserEmailOrderByCreatedAtDesc(
                                email
                        );

        List<Long> noteIds =
                bookmarks.stream()
                        .map(Bookmark::getNoteId)
                        .toList();

        return noteRepository
                .findByIdInOrderByCreatedAtDesc(
                        noteIds
                );
    }

    // CHECK BOOKMARKED
    public boolean isBookmarked(
            String email,
            Long noteId
    ) {

        return bookmarkRepository
                .findByUserEmailAndNoteId(
                        email,
                        noteId
                )
                .isPresent();
    }
}