package com.anurag.NotesWebsite.repository;

import com.anurag.NotesWebsite.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

//here i am saying i am working on user entity and the id type is Long(Primary key type)
@Repository
public interface UserRepository extends JpaRepository<User,Long> {


    Optional<User> findByEmail(String email);

    long count();

    List<User> findByEmailIn(
            List<String> emails
    );
}
/*
Here JPA repository provides method like
save(user);
findById(1L);
findAll();
delete(user);

findByEmail(String email) = spring boot internally converted it like this
                              select * from users where email = ?

Optional<User> = if a person is find that type is of User that's why we have user It's a simple return type

and if there is no user for that case we use Optional.
Optional = It is a container which holds the value and it can be empty.
           It saves us from null errors.
 */
