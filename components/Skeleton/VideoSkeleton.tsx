import styles from "../../styles/Skeleton.module.scss";


const Skeleton = () =>{
    return (
        <div className={styles.skeletonWrapper}>
          <div className={`${styles.videoSkeleton} ${styles.skeleton}`}></div>
         <div className={styles.videoInfoContainer}>
         <div className={`${styles.big} ${styles.skeleton}`}></div>
         <div className={`${styles.bigger} ${styles.skeleton}`}></div>
         <div className={`${styles.biggest} ${styles.skeleton}`}></div>
          </div>
        </div>
    )
}

export default Skeleton;