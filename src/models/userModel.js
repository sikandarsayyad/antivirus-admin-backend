class UserModel {
	constructor(user) {
		this.name = user.name;
		this.email = user.email;
		this.password = user.password;
		this.role = user.role;
	}
}

export default UserModel;
