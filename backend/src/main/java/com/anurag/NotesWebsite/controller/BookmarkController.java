package com.anurag.NotesWebsite.controller;

//import com.anurag.NotesWebsite.entity.Bookmark;
import com.anurag.NotesWebsite.service.BookmarkService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.anurag.NotesWebsite.entity.Note;

@RestController
@RequestMapping("/api/bookmarks")

//@CrossOrigin(origins = "*")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    // TOGGLE BOOKMARK
    @PostMapping("/{noteId}")
    public boolean toggleBookmark(

            @PathVariable Long noteId,

            Authentication authentication
    ) {

        String email =
                authentication.getName();

        return bookmarkService
                .toggleBookmark(
                        email,
                        noteId
                );
    }

    // GET USER BOOKMARKS
    @GetMapping
    public List<Note> getBookmarks(
            Authentication authentication
    ) {

        String email =
                authentication.getName();

        return bookmarkService
                .getUserBookmarks(
                        email
                );
    }

    // CHECK BOOKMARK
    @GetMapping("/check/{noteId}")
    public boolean isBookmarked(

            @PathVariable Long noteId,

            Authentication authentication
    ) {

        String email =
                authentication.getName();

        return bookmarkService
                .isBookmarked(
                        email,
                        noteId
                );
    }
}