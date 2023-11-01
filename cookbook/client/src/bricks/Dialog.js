import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function Dialog({ show, title, text, onConfirm, onCancel }) {

    return (
        <>
            <Modal show={show} onHide={onCancel} backdrop="static">

                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{text}</p>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex flex-row gap-2">
                        <Button variant="secondary" onClick={onCancel}>
                            Zrušit
                        </Button>
                        <Button variant="primary" onClick={onConfirm}>
                            Potvrdit
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal >
        </>
    );
}

export default Dialog;