import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/esm/Container";

const initialState = {
  name: "",
  phone: "",
  email: "",
  company: "",
  address: "",
  password: "",
  comfirmPass: "",
};

const passVerificationError = {
  isLenthy: false,
  hasUpper: false,
  hasLower: false,
  hasNumber: false,
  hasSpeclChr: false,
  comfirmPass: false,
};

export const RegistrationForm = () => {
  const [newUser, setNewUser] = useState(initialState);
  const [passwordError, setPasswordError] = useState(passVerificationError);

  useEffect(() => {}, [newUser]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });

    if (name === "password") {
      const isLenthy = value.length > 8;
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpeclChr = /[@,#,$,%,&]/.test(value);

      setPasswordError({
        ...passVerificationError,
        isLenthy,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpeclChr,
      });
    }

    if (name === "comfirmPass") {
      setPasswordError({
        ...passwordError,
        comfirmPass: newUser.password === value,
      });
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log(newUser);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2 className=" mb-3 mt-3  text-info">User Registration</h2>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <Form onSubmit={handleOnSubmit}>
            <Form.Group className="mb-1">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleOnChange}
                placeholder="Enter name"
              />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="number"
                name="phone"
                value={newUser.phone}
                onChange={handleOnChange}
                placeholder="Enter Phone"
              />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleOnChange}
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>Company name</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={newUser.company}
                onChange={handleOnChange}
                placeholder="Enter company"
              />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={newUser.address}
                onChange={handleOnChange}
                placeholder="Full address"
              />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleOnChange}
                placeholder="Password"
              />
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Comfirm Password</Form.Label>
              <Form.Control
                type="password"
                name="comfirmPass"
                value={newUser.comfirmPass}
                onChange={handleOnChange}
                placeholder="Comfirm Password"
              />
            </Form.Group>
            <Form.Text>
              {!passwordError.comfirmPass && (
                <div className="text-danger mb-2">Password does not match!</div>
              )}
            </Form.Text>

            <ul className="mb-4">
              <li
                className={
                  passwordError.isLenthy ? "text-success" : "text-danger"
                }>
                Min 8 character
              </li>
              <li
                className={
                  passwordError.hasUpper ? "text-success" : "text-danger"
                }>
                At least one upper case
              </li>
              <li
                className={
                  passwordError.hasLower ? "text-success" : "text-danger"
                }>
                At least one lower case
              </li>
              <li
                className={
                  passwordError.hasNumber ? "text-success" : "text-danger"
                }>
                At least one number
              </li>
              <li
                className={
                  passwordError.hasSpeclChr ? "text-success" : "text-danger"
                }>
                At least one of the special characters i.e @#$%&...
              </li>
            </ul>

            <Button
              variant="primary"
              type="submit"
              disabled={Object.values(passwordError).includes(false)}>
              Submit
            </Button>
          </Form>
        </Col>
        <Row className="py-2">
          <Col>
            Already have an account? {""}
            <a href="/">Login Now</a>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};
