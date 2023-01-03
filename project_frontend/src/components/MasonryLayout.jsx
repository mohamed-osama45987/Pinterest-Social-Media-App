
import Masonry from "react-masonry-css";
import Pin from "./Pin"; // one indvidual pin (card) layout

const breakpointObj = {
  default: 4,
  3000: 6, // on 3000 px screen show 6 coulmns
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

function MasonryLayout({ pins }) {
  return (
    <Masonry className="flex" breakpointCols={breakpointObj}>
      {pins?.map((pin) => (
        <Pin key={pin._id} pin={pin} className="w-max" />
      ))}
    </Masonry>
  );
}

export default MasonryLayout;
