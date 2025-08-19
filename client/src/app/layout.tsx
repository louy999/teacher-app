import NavBar from "./components/navBar";
import "./globals.css";
// import { Poppins } from "next/font/google";
import { Geist } from "next/font/google";

export const metadata = {
  title: "Course Chapters",
  description: "Explore chapters and lessons available in this course.",
};

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "700"],
// });
const geist = Geist({
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.className}>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body
      // className={`${poppins.className}  md:flex justify-center items-center w-full min-h-screen h-full md:p-5 antialiased bg-[#E7EBEE]`}
      >
        {/* <div className="container md:w-9/12  p-10 md:rounded-xl bg-white  md:min-h-[90vh] h-full shadow-2xl "> */}
        <div className=" ">
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}
