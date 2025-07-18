import { ThemeProvider } from "next-themes";
import SlideEditor from "./components/SlideEditor";

export default function App() {
  return (
    <ThemeProvider attribute="class">
      <div className="h-screen w-screen flex items-center justify-center p-4">
        <SlideEditor />
      </div>
    </ThemeProvider>
  );
}
