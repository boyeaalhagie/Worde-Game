# SWE 2710 - Group 1: Wordle

> Important Note:
> 
> The working directories for the frontend and backend are their respective folders. For the best experience, open `frontend` as a project in WebStorm, and `backend` as a project in IntelliJ.
> 
> If you are using Visual Studio Code, you can open the root directory as a workspace and then open the `frontend` and `backend` folders as separate projects. You will also need to install the `spring-boot` extension for Java in order to run the backend.
> 
> Additionally, the frontend and backend have their own `README.md` files with instructions on how to run them.

## Description
This project is a clone of the popular game Wordle. The game is a word puzzle game where the player has to guess a five-letter word within six attempts. After each guess, the game will provide feedback on the letters that are correct and in the correct position, the letters that are correct but in the wrong position, and the letters that are not in the word at all. The game will also provide a list of words that the player has already guessed. The game will end when the player guesses the word correctly or when the player runs out of attempts.

## Installation instructions
Before running the frontend, you'll want to install [`NodeJS`](https://nodejs.org/en/download) and make sure `npm` is installed as well. `npm` should be bundled with the `NodeJS` installer.

Before running the backend, you'll want to install [`Java`](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) and [`Maven`](https://maven.apache.org/download.cgi). 

You'll also need to have an IDE installed. We recommend using `WebStorm` for the frontend and `IntelliJ` for the backend. If you are using Visual Studio Code, you can open the root directory as a workspace and then open the `frontend` and `backend` folders as separate projects. You will also need to install the `spring-boot` extension for Java in order to run the backend.

## How to use the project
To run the frontend, navigate to the `frontend` directory and run the following commands:
```bash 
npm install
npm start
```
This will start the frontend on `localhost:3000`.

To run the backend, navigate to the `backend` directory and run the `WordleDriver` class. This will start the backend on `localhost:8080`.

## Team (names, contact info)
- [Paul Nutini](mailto:nutinip@msoe.edu)
- [Leigh Goetsch](mailto:goetschm@msoe.edu)
- [Alhagie Boye](mailto:boyea@msoe.edu)
- [Evan Roegner](mailto:roegnere@msoe.edu)
- [Joseph Barganz](mailto:barganzj@msoe.edu)

## Credits/Acknowledgements

Project dependencies:
- [Java](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [Maven](https://maven.apache.org/download.cgi)
- [NodeJS](https://nodejs.org/en/download)
- [npm](https://www.npmjs.com/)
- [React](https://reactjs.org/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Axios](https://axios-http.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Blueprint](https://blueprintjs.com/docs/)

Testing dependencies:
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Spring Boot Test](https://spring.io/guides/gs/testing-web/)
- [Mockito](https://site.mockito.org/)

Learning resources:
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Spring Boot Documentation](https://spring.io/guides/gs/spring-boot/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Bootstrap Documentation](https://react-bootstrap.github.io/getting-started/introduction/)
- [Blueprints Documentation](https://blueprints.io/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [SweetAlert](https://sweetalert2.github.io/)
- [Java and Spring Boot Tutorial](https://milanwittpohl.com/projects/tutorials/Full-Stack-Web-App/the-backend-with-java-and-spring)
- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)

Defects and Document/updates:
Sign up button only works on double click
