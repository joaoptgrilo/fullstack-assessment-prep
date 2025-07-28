import request from "supertest";
import app from "../app";
import db from "../database";
import { Option } from "@my-app/types";

beforeEach((done) => {
  db.run("UPDATE options SET votes = 0", [], (err) => {
    if (err) return done(err);
    done();
  });
});

describe("GET /api/v1/polls", () => {
  it("should return a 200 OK status", async () => {
    const response = await request(app).get("/api/v1/polls");
    expect(response.status).toBe(200);
  });

  it("should return a JSON array", async () => {
    const response = await request(app).get("/api/v1/polls");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should return an array with 6 poll objects", async () => {
    const response = await request(app).get("/api/v1/polls");
    expect(response.body.length).toBe(6);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("question");
  });
});

describe("GET /api/v1/polls/:id", () => {
  it("should return a single poll with its options for a valid ID", async () => {
    const response = await request(app).get("/api/v1/polls/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("question");
    expect(response.body).toHaveProperty("options");
    expect(response.body.options).toBeInstanceOf(Array);
    expect(response.body.options.length).toBeGreaterThan(0);
  });

  it("should return a 404 Not Found for an invalid ID", async () => {
    const response = await request(app).get("/api/v1/polls/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Poll not found." });
  });
});

describe("POST /api/v1/polls/:pollId/vote", () => {
  it("should increment the vote count and return a success message", async () => {
    const initialResponse = await request(app).get("/api/v1/polls/1");
    const optionToVoteFor = initialResponse.body.options.find(
      (o: Option) => o.id === 2
    );
    const initialVotes = optionToVoteFor.votes;

    const voteResponse = await request(app)
      .post("/api/v1/polls/1/vote")
      .send({ optionId: 2 });

    expect(voteResponse.status).toBe(200);
    expect(voteResponse.body).toEqual({
      message: "Vote registered successfully.",
    });

    const finalResponse = await request(app).get("/api/v1/polls/1");
    const updatedOption = finalResponse.body.options.find(
      (o: Option) => o.id === 2
    );
    const finalVotes = updatedOption.votes;

    expect(finalVotes).toBe(initialVotes + 1);
  });

  it("should return a 404 if the optionId does not belong to the pollId", async () => {
    const response = await request(app)
      .post("/api/v1/polls/1/vote")
      .send({ optionId: 10 });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Option not found for this poll." });
  });

  it("should return a 400 if optionId is not provided", async () => {
    const response = await request(app).post("/api/v1/polls/1/vote").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "optionId is required." });
  });
});
