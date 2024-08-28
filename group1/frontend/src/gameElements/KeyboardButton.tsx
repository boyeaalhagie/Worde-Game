import React, { useState } from "react";
import { Button } from "@blueprintjs/core";

interface IKeyboardButtonProps {
  children: string;
  onButtonClick: (letter: string) => void;
}

/**
 * Renders a keyboard button component.
 * @param props - The component props.
 * @returns The rendered Keyboard button
 */
export function KeyboardButton(props: IKeyboardButtonProps): React.ReactElement {
  const [pressed, setPressed] = useState(false);

  return (
    <div>
      <Button
        className={`keyboard-button ${pressed ? "pressed" : ""}`}
        key={props.children}
        id={props.children}
        small={false}
        large={true}
        onClick={() => {
          props.onButtonClick(props.children);
          setPressed(true);
        }}
      >
        {props.children}
      </Button>
    </div>
  );
}
