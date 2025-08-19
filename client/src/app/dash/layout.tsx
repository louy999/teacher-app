import NavDash from "./navDash";
export const metadata = {
  title: "Course Chapters",
  description: "Explore chapters and lessons available in this course.",
};

export default function dashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body>
      <NavDash />
      {children}
    </body>
  );
}
