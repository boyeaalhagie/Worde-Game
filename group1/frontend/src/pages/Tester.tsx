import React from "react";
import { Container } from "react-bootstrap";
import { getTestInterface } from "../test/TestInterface";

/**
 * Represents the Tester page component.
 * @component
 */
const Tester: React.FC = () => {
  return (
    <div>
      <header>
        <h1>Tester Page</h1>
      </header>
      <Container className="tests">
        <div style={{ height: "200px" }}></div>
        <div>
          <>{getTestInterface()}</>
        </div>
      </Container>
    </div>
  );
};

export default Tester;
