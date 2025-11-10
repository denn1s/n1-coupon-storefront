import styles from './HelloWorld.module.css'

export interface HelloWorldProps {
  message: string
}

const HelloWorld = ({ message }: HelloWorldProps) => {
  return <h1 className={styles.btn}>{message}</h1>
}

export default HelloWorld

