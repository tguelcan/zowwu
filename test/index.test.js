import test from "ava";
import request from "supertest";
import loader from "./../lib/app";

test.before(async (t) => {
    const { handler } = await loader();
    t.context.handler = handler;
});

test.serial("GET /messages 200", async (t) => {
    const { handler } = t.context;

    const { status, body } = await request(t.context.handler).get("/messages");
    t.is(status, 200);
    t.deepEqual(body, {
        status: "route:messages",
    });
});

test.serial("GET /noroute 404", async (t) => {
    const { handler } = t.context;

    const { status } = await request(t.context.handler).get("/noroute");
    t.is(status, 404);
});

test.serial("GET /messages/123 200", async (t) => {
    const { handler } = t.context;

    const { status, body } = await request(t.context.handler).get(
        "/messages/123"
    );
    t.is(status, 200);
    t.deepEqual(body, {
        status: "123",
    });
});

test.serial("GET /content 200", async (t) => {
    const { handler } = t.context;

    const { status, body } = await request(handler).get("/content");
    t.is(status, 200);
    t.deepEqual(body, {
        status: "route:content",
    });
});

test.serial("GET /content/deeper 200", async (t) => {
    const { handler } = t.context;

    const { status, body } = await request(handler).get("/content/deeper");
    t.is(status, 200);
    t.deepEqual(body, {
        status: "route:content:deeper",
    });
});
