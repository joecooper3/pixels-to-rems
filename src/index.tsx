import { useEffect, useState } from "react";
import { List } from "@raycast/api";

export default function CommandWithCustomEmptyView() {
  const [state, setState] = useState({ searchText: "", items: [] });
  const [pixelValue, setPixelValue] = useState("");
  const [remValue, setRemValue] = useState("");
  const [unitGiven, setUnitGiven] = useState("");

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
      setPixelValue(`${parseFloat(numbersOnly) * 16}px`);
      setRemValue(`${parseFloat(numbersOnly) / 16}rem`);
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
          {unitGiven !== "rem" && <List.Item title="To rem" detail={<List.Item.Detail markdown={`# ${remValue}`} />} />}
          {unitGiven !== "px" && (
            <List.Item title="To pixels" detail={<List.Item.Detail markdown={`# ${pixelValue}`} />} />
          )}
        </>
      )}
    </List>
  );
}
