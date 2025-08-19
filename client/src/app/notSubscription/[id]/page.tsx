import axios from "axios";
import GoHomeButton from "./bottonGoTo";

interface Params {
  id: string;
}

const NotSubscription = async ({ params }: { params: Promise<Params> }) => {
  try {
    const resolvedParams = await params;

    const res = await axios.get(
      `${process.env.local}/lessons/${resolvedParams.id}`
    );

    return (
      <div
        style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}
        className="absolute top-2/4 left-2/4 -translate-2/4"
      >
        <h2>You are not subscribed to this lesson:</h2>
        <h3>{res?.data.data.title || "Lesson title not available"}</h3>
        <p>Please contact the Teacher to subscribe to this lesson.</p>
        <GoHomeButton />
      </div>
    );
  } catch (error) {
    console.log(error);
  }
};

export default NotSubscription;
