
export default function ToggleButton({selected, text, onClickReportFunc}) {

    function handleClick() {

        console.log("button clicked");
        onClickReportFunc();

    }

    return (

        <button class="bg-slate-300 hover:bg-green-300 rounded p-2" onClick={() => handleClick()}>{text}</button>

    )
}