// Import dependencies, declarations and components

import dayjs from "dayjs";

/**
 * A function to convert colours in hex format to RGB (Red, Green Blue) format.
 * @param {String} hex - the hex to be converted to RGB.
 * @returns {String} - the RGB value corresponding to the parsed hex code.
 */
const hexToRgb = (hex) => {
    hex = hex.replace('#', '');
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
};

/**
 * Badges
 * @param {String} code - the tasks parent channels' code.
 * @param {String} colour - the colour of the tasks parent channel, in hex format.
 * @param {String} dueDate - the tasks due date in "YYYY-MM-DD" format.
 * @returns 
 */
function Badges({ code, colour, dueDate }) {
    const styling ="flex-center text-[0.85rem] text-text font-medium rounded-steep " +
            "px-base py-xs whitespace-nowrap";

    return (
        <div className="flex justify-between mt-base">
            <div 
                className={styling}
                style={{ background: hexToRgb(colour) }}>
                    # {code.replace(/\s/g, "").toUpperCase()}
            </div>
            <div 
                className={styling}
                style={{ background: hexToRgb(colour) }}>
                    @ {dayjs(dueDate).format("DD-MM-YYYY")}
            </div>
        </div>
    );
}

export default Badges;
