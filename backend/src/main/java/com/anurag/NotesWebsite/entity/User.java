package com.anurag.NotesWebsite.entity;

//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;


@Entity
@Table(name="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//@JsonIgnoreProperties(ignoreUnknown = true)
public class User {
    //Here Id annotation = I'm making it as a primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Id will be auto increment
    private Long id;

    private String name;

    @Column(unique = true) // email should not be duplicate
    private String email;

    @com.fasterxml.jackson.annotation.JsonProperty(
            access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY
    )
    private String password;
    private String role;
    //private String bio;

    private String profilePic;

    private String fullName;

    @Column(length = 500)
    private String bio;

    private String profileImage;

    // SUBSCRIPTION

    private Boolean premium = false;

    private String plan = "FREE";

    private LocalDateTime premiumExpiry;

    private Boolean banned = false;

    private LocalDateTime banExpiry;
}
/*Here @builder annotation remembers which value belongs to what field like this:
User user = User.builder()
        .name("Anurag")
        .email("test@gmail.com")
        .password("123")
        .role("USER")
        .build();
        Like It will make sure that email is not equal to Anurag(name) like this
 */