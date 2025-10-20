import React from "react";
import axios from "axios";

const SubscribeDash = async () => {
  try {
    const res = await axios.get(
      `${process.env.local}/m/trans/teacher/${process.env.teacherId}`
    );
    console.log(res.data.data);

    return <div>SubscribeDash</div>;
  } catch (error) {
    return <div>{error}</div>;
  }
};

export default SubscribeDash;

// import React from "react";

// const SubscribeDash = () => {

//   return <div>SubscribeDash</div>;
// };

// export default SubscribeDash;
