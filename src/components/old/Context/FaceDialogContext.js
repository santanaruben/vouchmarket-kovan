import { createContext } from "react";

const FaceDialogContext = createContext({
  faceDialog: false,
  setFaceDialog: (value) => {},
});

export default FaceDialogContext;
