import { useEffect, useState } from "react";
import { Action, ActionPanel, List, getPreferenceValues } from "@raycast/api";

interface Preferences {
  rootFontSize: string;
}

export default function CommandWithCustomEmptyView() {
  const [state, setState] = useState({ searchText: "", items: [] });
  const [pixelValue, setPixelValue] = useState("");
  const [remValue, setRemValue] = useState("");
  const [unitGiven, setUnitGiven] = useState("");

  const preferences = getPreferenceValues<Preferences>();
  const { rootFontSize } = preferences;

  const PX_REGEX = /px$/;
  const REM_REGEX = /rem$/;
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
      setPixelValue(`${parseFloat(numbersOnly) * parseInt(rootFontSize)}px`);
      setRemValue(`${parseFloat(numbersOnly) / parseInt(rootFontSize)}rem`);
    }
  }, [state.searchText]);

  return (
    <List
      onSearchTextChange={(newValue) => setState((previous) => ({ ...previous, searchText: newValue }))}
      isShowingDetail
    >
      {state.searchText === "" && pixelValue !== "" ? (
        <List.EmptyView title="Type something to get started" />
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
              detail={<List.Item.Detail markdown={`# ${remValue}`} />}
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
              detail={<List.Item.Detail markdown={`# ${pixelValue}`} />}
            />
          )}
        </>
      )}
    </List>
  );
}
