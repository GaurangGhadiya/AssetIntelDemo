import { useEffect, useRef , useState} from "react";
import {
    ContentBlock,
    Editor,
    EditorState,
    convertFromRaw,
    convertToRaw
  } from "draft-js";
import { headingTextHandler } from "../utils/headingText";
import { underlineTextHandler } from "../utils/underlineText";
import { redTextHandler } from "../utils/redText";
import { boldTextHandler } from "../utils/boldText";

const TextEditor = () => {
    const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  
    const refElement = useRef(null);
    useEffect(() => {
        let localItem = localStorage.getItem("editorContext");
        if (localItem) {
          const context = convertFromRaw(JSON.parse(localItem));
          setEditorState(EditorState.createWithContent(context));
        }
      }, []);

      const saveTextHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem(
          "editorContext",
          JSON.stringify(convertToRaw(editorState.getCurrentContent()))
        );
      };
       
    function styleFunction(contentBlock) {
        const type = contentBlock.getType();
        if (type === "block-bold") {
          return "BoldBlock";
        }
        if (type === "block-red") {
          return "RedBlock";
        }
        if (type === "block-underline") {
          return "UnderlineBlock";
        }
      }
    const onChangeHandler = (editorState) => {
        const selection = editorState.getSelection();
        const content = editorState.getCurrentContent();
        const block = content.getBlockForKey(selection.getStartKey());
        const text = block.getText();
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();
        const blockKey = block.getKey();
    
        if (text.startsWith("# ")) {
          const newEditorState = headingTextHandler(
            selectionState,
            contentState,
            block,
            text,
            blockKey,
            editorState
          );
          setEditorState(newEditorState);
          return true;
        } else if (text.startsWith("*** ")) {
          const newEditorState = underlineTextHandler(
            selectionState,
            contentState,
            block,
            text,
            blockKey,
            editorState
          );
          setEditorState(newEditorState);
          return true;
        } else if (text.startsWith("** ")) {
          const newEditorState = redTextHandler(
            selectionState,
            contentState,
            block,
            text,
            blockKey,
            editorState
          );
          setEditorState(newEditorState);
          return true;
        } else if (text.startsWith("* ")) {
          const newEditorState = boldTextHandler(
            selectionState,
            contentState,
            block,
            text,
            blockKey,
            editorState
          );
          setEditorState(newEditorState);
          return true;
        }
        setEditorState(editorState);
    
        return false;
      };
  return (
    <>
    <div className="NavContainer">
        <div></div>
        <h2 className="TextTitle">Demo editor by Gaurang Ghadiya</h2>
        <button onClick={saveTextHandler} className="Button">Save Text</button>
      </div>
      <div
        onClick={() => {
          refElement.current && refElement.current.focus();
        }}
        className="TextEditorContainer"
      >
        <Editor
          ref={refElement}
          editorState={editorState}
          onChange={onChangeHandler}
          blockStyleFn={styleFunction}
        />
      </div>
    </>
     
  )
}

export default TextEditor