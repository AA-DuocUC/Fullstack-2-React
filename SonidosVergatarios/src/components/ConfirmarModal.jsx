import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function ConfirmarModal({
  abierto,
  titulo,
  children,
  confirmar,
  cancelar,
}) {
  return (
    <Modal
      show={abierto}
      onHide={cancelar}
      centered
      aria-labelledby="titulo-confirmar"
    >
      <Modal.Header closeButton>
        <Modal.Title id="titulo-confirmar">{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cancelar}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={confirmar}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
