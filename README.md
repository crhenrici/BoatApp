# Boat Application
This is a small sample Java SpringBoot + Angular application that let's you manage boats. It's a simple CRUD application where you can:
* list boats
* view detailed boat informatiom
* create boats
* delete boats

From the requirements description it was not clear for me if the user should be able to see its own boat repository or if every users sees the same boats. I went with the assumption that every user should see every boat. In case, each user should see their own boats it will require a small modification in the data model. User would require a field with a set of boats as following:
```
   @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(	name = "user_boats",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "boat_id"))
    private Set<Boat> roles = new HashSet<>();
```

## How to run
This sample application uses docker to run the application. First, make sure you have docker installed. Then you can run the application as following `docker-compose build --no-cache && docker-compose up -d`. <br>
Once it's up you can access the application on `localhost:4200`. <br>
You'll first need to register a user before login.

## Tech stack
This web application was developed as a simple server-client architecture. The backend was developed with:
* Java 21
* SpringBoot
* H2 database (for local development)
* MariaDB (for prod)

Frontend was being developed with:
* Angular 19.2
* Node 22.5

## Improvements
As this is a sample application, it is far from being perfect and done. Therefore, there are a couple of things that can be improved:
- [ ] UI/UX improvements
   - [ ] use icons as button
   - [ ] make home navigation more intuitive
   - [ ] implement a navigation bar
   - [ ] better CSS styling
- [ ] Adjustment to User model to include set of boats (if that is the requirement)
- [ ] Use [MapStruct](https://mapstruct.org) for when DTOs and Models become bigger
- [ ] Use [PageObject pattern](https://martinfowler.com/bliki/PageObject.html) for clean UI testing
- [ ] Add password strength checker
- [ ] Matching passwords
- [ ] More server-side validation
- [ ] Implement HttpCookies
  - Currently, you have to login again on a page refresh or when you navigate to a page through URL (also a page refresh) because the token is stored in memory. I went with this appraoch because using localStorage exposes the threat of XSS