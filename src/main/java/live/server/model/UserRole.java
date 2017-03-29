package live.server.model;

public enum UserRole {
	SUPER_ADMIN(1000),ADMIN(100),EXPERT(10),USER(0);
	
    int role;

    UserRole(int role) {
        this.role = role;
    }

    public int getRole() {
        return role;
    }
}
