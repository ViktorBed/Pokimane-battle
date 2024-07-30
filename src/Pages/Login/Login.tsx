import LoginButton from "./LoginButton/LoginButton";
import s from './Login.module.scss';

const Login: React.FC = () => {
    return (
        <div className={s.loginContainer}>
            <form className={s.loginForm}>
                <h2>Login</h2>
                    <h3>Use Google</h3>
                <LoginButton />
            </form>
        </div>
    );
};

export default Login;
