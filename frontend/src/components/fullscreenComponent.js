import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";

const FullScreenToggle = () => {
  const goFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        alert(
          `Error attempting to enable full-screen mode: ${e.message} (${e.name})`
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={goFullScreen}
    //   style={{ marginTop: "10px" }}
    >
      <FontAwesomeIcon icon={faExpand} />
    </Button>
  );
};

export default FullScreenToggle;
