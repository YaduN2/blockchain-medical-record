import HomeFallback from "@/components/HomeFallback";
import styles from "../styles/page.module.css";
import { UserButton } from "@clerk/nextjs";


export default function Home() {
  let isAuth = 1;
  // 0 -> not auth
  // 1 -> patient
  // 2 -> doctor

  return (
    <main>
      <HomeFallback />
    </main>
  );
}
