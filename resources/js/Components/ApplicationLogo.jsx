export default function ApplicationLogo(props) {
    return (
        <div className="flex items-center space-x-2">
            <img
                src="/assets/img/logo-insta.svg"
                alt="Application Logo"
                {...props}
            />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">InstaApp</h1>
        </div>
    );
}
