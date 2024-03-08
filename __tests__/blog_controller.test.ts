import supertest from "supertest";
import app from "../src/index";
import { BlogModel } from "../src/models/blog_model";
import { UserModel } from "../src/models/user_model";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { servers } from "../src/index";
dotenv.config();

jest.setTimeout(30000);

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


let token: string | undefined;
let newBlogId: string | undefined;

const admin = {
  email: 'martine@gmail.com',
  password: '12345678',
  userRole: "admin"
};

const blogDataArray = [
  {
    title: "First Blog",
    author: "First Author",
    publishedDate: "2024-03-12",
    shortDescript: "First Short Description",
    description: "First Description",
    imageLink: "https://first-blog.com/image.jpg",
  },
  {
    title: "Second Blog",
    author: "Second Author",
    publishedDate: "2024-03-13",
    shortDescript: "Second Short Description",
    description: "Second Description",
    imageLink: "https://second-blog.com/image.jpg",
  },
  {
    title: "Third Blog",
    author: "Third Author",
    publishedDate: "2024-03-14",
    shortDescript: "Third Short Description",
    description: "Third Description",
    imageLink: "https://third-blog.com/image.jpg",
  }
];

describe('User login', () => {
  beforeAll(async () => {
    // Register a user for login tests
    const userData = {
      email: "test@example.com",
      password: "passwordyes",
      userRole: "admin",
    };
    await supertest(app).post("/auth/register").send(userData);
  });

  it("should log in the user and return an access token", async () => {
    const userData = {
      email: "test@example.com",
      password: "passwordyes",
    };

    const response = await supertest(app)
      .post("/auth/login")
      .send(userData)
      .expect(200);
      token = response.body.token;
      console.log("tokennnn",response.body.token);
      
    expect(response.body).toHaveProperty("token");
  });
});

  describe("Admin Protected Routes", () => {
    it("should create a new blog", async () => {
      const newBlogData = {
        title: "Test Blog",
        author: "Test Author",
        publishedDate: "2024-03-11",
        shortDescript: "Short Description",
        description: "Description",
        imageLink: "https://test-image.com/image.jpg",
      };
      const response = await request
        .post("/blogs/create")
        .set("Cookie", `jwt=${token}`)
        .send(newBlogData)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.title).toEqual(newBlogData.title);
      newBlogId = response.body._id;
    });

    it("should update an existing blog", async () => {
      const updatedBlogData = {
        title: "Updated Blog Title",
        author: "Updated Author",
        publishedDate: "2024-03-11",
        shortDescript: "Updated Short Description",
        description: "Updated Description",
        imageLink: "https://test-image.com/updated-image.jpg",
      };

      const response = await request
        .patch(`/blogs/${newBlogId}`)
        .set('Cookie', `jwt=${token}`)
        .send(updatedBlogData)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.title).toEqual(updatedBlogData.title);
    });
    it("should publish an existing blog", async () => {
     
       const requestBody = {
        title: "Test Blog",
        publishedDate: "2024-03-11"
      };
     
      const response = await request
        .post("/blogs/publish")
        .set('Cookie', `jwt=${token}`)
        .send(requestBody)
        .expect(200);
    
      const publishedBlog = await BlogModel.findById(newBlogId);
      expect(publishedBlog).toBeDefined();
    });
    
    

    // it("should delete an existing blog", async () => {
    //   await request
    //     .delete(`/blogs/${newBlogId}`)
    //     .set('Cookie', `jwt=${token}`)
    //     .expect(200);

    //   const deletedBlog = await BlogModel.findById(newBlogId);
    //   expect(deletedBlog).toBeNull();
    //  });
      
  });
  describe("get all blogs GET /blogs",()=>{
    it('It should fetch all blogs', async () => {
        try {
          
            await BlogModel.insertMany(blogDataArray);
            const response = await request
                .get('/blogs')
                .set("Cookie", `jwt=${token}`)
                .expect(200)
                .send(blogDataArray)
                
                expect(response.body).toBeInstanceOf(Array); 
                expect(response.body.length).toBeGreaterThan(0);   
  
        } catch (error) {
            
            throw error; 
        }
    });
   
    });
    describe('Fetch a blog by Id', () => {
      it('should fetch one blog by ID', async () => {
        try {
          let blogId: string | undefined;
          const blog = await BlogModel.findOne({ isPublished: true }); // Find a published blog
          if (blog) {
            blogId = blog._id.toHexString();
            const response = await supertest(app)
              .get(`/blogs/published/${blogId}`);
            expect(response.status).toBe(200);
          } else {
            throw new Error('No published blog found');
          }
        } catch (error) {
          throw error;
        }
      });
    });
    
    
    describe('DELETE /blogs/:id', () => {
      it('should delete a blog by ID', async () => {
        try {
          let blogId: string = '';
          const blogs = await BlogModel.find({});
          if (blogs.length > 0) {
            blogId = blogs[0]._id.toHexString();
          }
    
          const response = await supertest(app)
            .delete(`/blogs/${blogId}`)
            .set('Cookie', `jwt=${token}`);
    
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body._id).toEqual(blogId);
    
          const deletedblog = await BlogModel.findById(blogId);
          expect(deletedblog).toBeNull();
        } catch (error) {
          throw error;
        }
      });
      
    });
    

//   describe("Unprotected Routes", () => {
//     it("should retrieve all published blogs", async () => {
//       const response = await request.get("/blogs/published").expect(200);
//       expect(response.body).toBeDefined();
//       expect(Array.isArray(response.body)).toBe(true);
//     });
//   });
// });
