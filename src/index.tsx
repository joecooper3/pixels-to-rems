import { useEffect, useState } from "react";
import { Action, ActionPanel, Icon, List, getPreferenceValues } from "@raycast/api";

interface Preferences {
  rootFontSize: string;
}

export default function CommandWithCustomEmptyView() {
  const [state, setState] = useState({ searchText: "", items: [] });
  const [pixelValue, setPixelValue] = useState("");
  const [remValue, setRemValue] = useState("");
  const [unitGiven, setUnitGiven] = useState("");
  const [enteredNumber, setEnteredNumber] = useState("");

  const preferences = getPreferenceValues<Preferences>();
  const { rootFontSize } = preferences;

  const PX_REGEX = /p|px$/;
  const REM_REGEX = /r$|re$|rem$/;
  const DECIMAL_REGEX = /\./;

  useEffect(() => {
    if (REM_REGEX.test(state.searchText) || DECIMAL_REGEX.test(state.searchText)) {
      setUnitGiven("rem");
    } else if (PX_REGEX.test(state.searchText)) {
      setUnitGiven("px");
    } else {
      setUnitGiven("");
    }
    const numbersOnly = state.searchText.replace(/[^.^0-9]/g, "");
    if (numbersOnly) {
      setEnteredNumber(numbersOnly);
      setPixelValue(`${parseFloat(numbersOnly) * parseInt(rootFontSize)}px`);
      setRemValue(`${parseFloat(numbersOnly) / parseInt(rootFontSize)}rem`);
    } else {
      setPixelValue("");
      setRemValue("");
      setEnteredNumber("");
    }
  }, [state.searchText]);

  return (
    <List
      onSearchTextChange={(newValue) => setState((previous) => ({ ...previous, searchText: newValue }))}
      isShowingDetail={state.searchText !== ""}
      searchBarPlaceholder="Enter a number"
    >
      {state.searchText === "" && enteredNumber === "" ? (
        <List.EmptyView title={`Example queries: "26", "200px", "2.125rem"`} icon={Icon.Desktop} />
      ) : (
        <>
          {unitGiven !== "rem" && (
            <List.Item
              title="To rem"
              actions={
                <ActionPanel title="Copy to clipboard">
                  <Action.CopyToClipboard title="Copy to clipboard" content={remValue} />
                </ActionPanel>
              }
              detail={<List.Item.Detail markdown={`${enteredNumber}px -> \n\n# ${remValue}`} />}
            />
          )}
          {unitGiven !== "px" && (
            <List.Item
              title="To pixels"
              actions={
                <ActionPanel title="Copy to clipboard">
                  <Action.CopyToClipboard title="Copy to clipboard" content={pixelValue} />
                </ActionPanel>
              }
              detail={<List.Item.Detail markdown={`${enteredNumber}rem -> \n\n# ${pixelValue}`} />}
            />
          )}
        </>
      )}
    </List>
  );
}
