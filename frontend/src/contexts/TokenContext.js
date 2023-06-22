import { createContext, useState } from "react";
import tokenService from "services/token.service";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const TokenContext = createContext();

export const TokenContextProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);

  function notifyTokenUpdate() {
    setVisible(!visible);
    if (visible) {
      tokenService
        .updateJWTToken()
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  const closeBtn = (
    <button className="close" onClick={() => notifyTokenUpdate()} type="button">
      &times;
    </button>
  );

  return (
    <TokenContext.Provider value={{ notifyTokenUpdate }}>
      {children}
      <Modal
        isOpen={visible}
        toggle={() => notifyTokenUpdate()}
        keyboard={false}
      >
        <ModalHeader toggle={() => notifyTokenUpdate()} close={closeBtn}>
          Alert!
        </ModalHeader>
        <ModalBody>
          Ups! It seems that your plan has changed. The page will be reloaded
          after closing this message.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => notifyTokenUpdate()}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </TokenContext.Provider>
  );
};

export default TokenContext;
