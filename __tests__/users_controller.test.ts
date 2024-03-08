import app from "../src/index";
import { UserModel } from "../src/models/user_model";
import supertest from "supertest";
import mongoose from "mongoose";
import { Server } from 'http';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { servers } from "../src/index";
import dotenv from "dotenv";
import { throttle } from "lodash";
dotenv.config();

let server: Server;
jest.setTimeout(30000);

let token: string | undefined;

const request = supertest(app);
const MONGO_URL: string = process.env.MONGO_URL!;
beforeAll(async () => {
  servers;
  await mongoose.connect(MONGO_URL);
});
afterEach(async () => {
  servers.close();
});
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// REGISTERING A USER TEST

const newUser = {
  email: 'martine@gmail.com',
  password: '12345678',
  userRole: "admin"
};

const manyUsers = [
{
  email: 'john.doe@example.com',
  password: 'password123',
  userRole: 'user'
},

 {
  email: 'jane.smith@example.com',
  password: 'securePassword',
  userRole: 'user'
},

{
  email: 'alice.johnson@example.com',
  password: 'example123',
  userRole: 'user'
}
];

describe("User Authentication", () => {

  describe("POST /auth/register", () => {
    it("should create a new user when all required credentials are provided", async () => {
     try{
      const response = await request
      .post("/auth/register")
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body).toHaveProperty("_id");
    const savedUser = await UserModel.findOne({ email: newUser.email });
    expect(savedUser).toBeTruthy();
    
     }catch(error){
      throw error;
     }
    });

    it("should return a 400 error if email is missing", async () => {
      const newUser = {
        password: "password",
        userRole: "user",
      };

      await request.post("/auth/register").send(newUser).expect(400);
    });

    it("should return a 400 error if password is missing", async () => {
      const userData = {
        email: "test@example.com",
        userRole: "user",
      };

      await supertest(app).post("/auth/register").send(userData).expect(400);
    });

    it('should give 400 status when body is empty', async () => {
      try {
          const response = await (supertest(app) as any)
              .post('/auth/register')
              .send("");
              console.log(response.status);
          expect(response.status).toBe(400);
          expect(response.body).toBeNaN;
      } catch (error) {
          
          throw error;
      }
  });

  it('should return 400 if users exist  ', async () => {
    try {
        let email : string = "";
        const getUser = await UserModel.find({});
        for (const iterator of getUser) {
            email = iterator.email;
        }
        const response = await (supertest(app) as any)
            .post('/auth/register')
            .send(email);
            console.log(response.status);
        expect(response.status).toBe(400);
    } catch (error) {
        
        throw error;
    }
});
  });

  describe("POST /auth/login", () => {
    beforeAll(async () => {
      // Register a user for login tests
      const userData = {
        email: "test@example.com",
        password: "password",
        userRole: "user",
      };
      await supertest(app).post("/auth/register").send(userData);
    });

    it("should log in the user and return an access token", async () => {
      const userData = {
        email: 'martine@gmail.com',
        password: '12345678'
      };

      const response = await supertest(app)
        .post("/auth/login")
        .send(userData)
        .expect(200);
        token = response.body.token;
      expect(response.body).toHaveProperty("token");
    });

    it("should return a 400 error if email is missing", async () => {
      const userData = {
        password: "password",
      };

      await supertest(app)
        .post("/auth/login")
        .send(userData)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Email is required");
        });
    });

    it("should return a 400 error if user is not found", async () => {
      const userData = {
        email: "nonexistent@example.com",
        password: "password",
      };

      await supertest(app)
        .post("/auth/login")
        .send(userData)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Invalid email or password");
        });
    });

    it("should return a 400 error if password is incorrect", async () => {
      const userData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      await supertest(app)
        .post("/auth/login")
        .send(userData)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Invalid email or password");
        });
    });
   });
});
describe("get all users GET /users",()=>{
  it('It should fetch all users', async () => {
      try {
        
          await UserModel.insertMany(manyUsers);
          const response = await request
              .get('/users')
              .set("Cookie", `jwt=${token}`)
              .expect(200)
              .send(manyUsers)
              
              expect(response.body).toBeInstanceOf(Array); 
              expect(response.body.length).toBeGreaterThan(0);   

      } catch (error) {
          
          throw error; 
      }
  });
  it('should return a 400 error if unable to fetch users', async () => {
    jest.spyOn(UserModel, 'find').mockRejectedValue(new Error('Unable to fetch users'));
    
    try {
      const response = await request
        .get('/users')
        .set('Cookie', `jwt=${token}`);
    
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'can not get users' });
    } catch (error) {
      throw error;
    } finally {
      jest.restoreAllMocks();
    }
  });
  

  });

describe('Fetch a User by Id', () => {
  it('should fetch one user by ID', async () => {
    try {
      let userId: string = '';
      const users = await UserModel.find({});
      if (users.length > 0) {
        userId = users[0]._id.toHexString();
      }
      const response = await supertest(app)
        .get(`/users/${userId}`)
        .set('Cookie', `jwt=${token}`);

      expect(response.status).toBe(200);
    } catch (error) {
      throw error;
    }
  });
});

describe('DELETE /users/:id', () => {
  it('should delete a user by ID', async () => {
    try {
      let userId: string = '';
      const users = await UserModel.find({});
      if (users.length > 0) {
        userId = users[0]._id.toHexString();
      }

      const response = await supertest(app)
        .delete(`/users/${userId}`)
        .set('Cookie', `jwt=${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body._id).toEqual(userId);

      const deletedUser = await UserModel.findById(userId);
      expect(deletedUser).toBeNull();
    } catch (error) {
      throw error;
    }
  });
  
});


  // describe("POST /users/password", () => {
  //   it("should reset a user's password", async () => {
  //     const user = new UserModel({
  //       username: "testuser",
  //       email: "test@example.com",
  //       password: await bcrypt.hash("password", 10),
  //     });
  //     await user.save();

  //     const newPassword = "newpassword";

  //     const response = await request
  //       .post("/users/password")
  //       .send({ email: user.email, password: newPassword })
  //       .expect(200);

  //     expect(response.body).toBeDefined();
  //     expect(response.body.message).toEqual("Password updated successfully");

  //     const updatedUser = await UserModel.findById(user._id);
  //     expect(updatedUser).toBeDefined();
  //     const passwordMatch = await bcrypt.compare(
  //       newPassword,
  //       updatedUser!.password
  //     );
  //     expect(passwordMatch).toBe(true);
  //   });

  //   it("should return 400 if email or password is missing", async () => {
  //     await request.post("/users/password").send({}).expect(404);
  //   });

  //   it("should return 404 if user not found", async () => {
  //     await request
  //       .post("/users/password")
  //       .send({ email: "nonexistent@example.com", password: "newpassword" })
  //       .expect(404);
  //   });
  // });
//});
