import axios from "axios";
class AuthService {
	constructor() {
		let service = axios.create({
			baseURL: 'https://meshsocialserver.herokuapp.com/api',
			withCredentials: true,
		});
		this.service = service;
	}

	signup(user) {
		return this.service.post("/signup", user);
	}

	login(username, password) {
		return this.service.post("/login", { username, password });
	}

	logout() {
		return this.service.post("/logout");
	}

	loggedin() {
		return this.service.get("/loggedin");
	}

}
export default AuthService