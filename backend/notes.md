PasswordEncoder = It is an interface which is used to encode (hash) the password and verify
BCryptpasswordEncoder = PasswordEncoder interface implementation is written inside this class
                        It convert the password in secure hash 
                        example- 123456 → $2a$10$abcxyz...
                                 123456 → $2a$10$differenthash...

                                 same input but different output