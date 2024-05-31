import React, { useState } from "react";
import {
  Modal,
  Button,
  Dropdown,
  DropdownButton,
  Form,
  Row,
  Col,
} from "react-bootstrap";

const MachineSelectionModal = ({
  show,
  handleClose,
  setMachineNumber,
  setTitleKeyword,
}) => {
  const [selectedMachine, setSelectedMachine] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [dropdownTitle, setDropdownTitle] = useState("Select Machine");


  const machines = [
    { id: "HkkBgtMainDetection-1", name: "HkkBgtMainDetection-1" },
    { id: "HkkBgtMainDetection-2", name: "HkkBgtMainDetection-2" },
    { id: "HkkBctDetection-1", name: "HkkBctDetection-1" },
    { id: "HkkBctDetection-2", name: "HkkBctDetection-2" },
    { id: "HkkBctDetection-3", name: "HkkBctDetection-3" },
  ];
  const machineGroups = {
    "All HkkBgtMainDetection": [
      "HkkBgtMainDetection-1",
      "HkkBgtMainDetection-2",
    ],
    "All HkkBctDetection": [
      "HkkBctDetection-1",
      "HkkBctDetection-2",
      "HkkBctDetection-3",
    ],
  };

  const titleKeywords = ["Before", "After"];

  const handleSubmit = () => {
    if (selectedMachine) {
      setMachineNumber(selectedMachine); // Update parent state directly
      setTitleKeyword(selectedKeyword);
      handleClose(); // Close the modal after selection
    }
  };

  // const handleSelect = (eventKey) => {
  //   if (eventKey in machineGroups) {
  //     // If a group is selected, use all machine IDs from the group
  //     setSelectedMachine(machineGroups[eventKey]);
  //   } else {
  //     // If an individual machine is selected, use just that one machine ID
  //     setSelectedMachine([eventKey]);
  //   }
  //   // setMachineNames(selectedMachineNames); // Assuming this function updates the state in the parent component
  // };
  const handleSelect = (eventKey, event) => {
    if (eventKey in machineGroups) {
      setSelectedMachine(machineGroups[eventKey]);
      setDropdownTitle(event.target.innerText);
    } else {
      setSelectedMachine([eventKey]);
      setDropdownTitle(event.target.innerText);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select a Machine</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please select a machine from the dropdown to proceed:</p>
        <Form>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Machine:
            </Form.Label>
            <Col sm={10}>
              <DropdownButton
                id="dropdown-machines"
                title={dropdownTitle}
                onSelect={handleSelect}
              >
                {machines.map((machine) => (
                  <Dropdown.Item key={machine.id} eventKey={machine.id}>
                    {machine.name}
                  </Dropdown.Item>
                ))}
                <Dropdown.Item eventKey="All HkkBgtMainDetection">
                  All HkkBgtMainDetection
                </Dropdown.Item>
                <Dropdown.Item eventKey="All HkkBctDetection">
                  All HkkBctDetection
                </Dropdown.Item>
              </DropdownButton>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Location:
            </Form.Label>
            <Col sm={10}>
              <DropdownButton
                id="dropdown-keyword-button"
                title={selectedKeyword || "Select Keyword"}
                onSelect={(eventKey) => setSelectedKeyword(eventKey)}
              >
                {titleKeywords.map((keyword, index) => (
                  <Dropdown.Item key={index} eventKey={keyword}>
                    {keyword}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MachineSelectionModal;
