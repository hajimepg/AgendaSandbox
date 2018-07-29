import test from "ava";
import Agenda from "agenda";

test("create queue", async (t) => {
    t.plan(0);

    const queue = new Agenda({ db: { address: "mongodb://127.0.0.1/agenda" } });

    await queue.start();
});

test("create job", async (t) => {
    t.plan(0);

    const queue = new Agenda({ db: { address: "mongodb://127.0.0.1/agenda" } });

    await queue.start();

    // noinspection JSCheckFunctionSignatures
    await queue.now("test");
});

test("process job", (t) => {
    return new Promise(async (resolve) => {
        const queue = new Agenda({ db: { address: "mongodb://127.0.0.1/agenda" } });

        // noinspection JSCheckFunctionSignatures
        queue.define("test job", (job, done) => {
            // noinspection JSUnresolvedVariable
            t.is(1, job.attrs.data.lhs);
            // noinspection JSUnresolvedVariable
            t.is(2, job.attrs.data.rhs);

            done();

            resolve();
        });

        await queue.start();

        // noinspection JSCheckFunctionSignatures
        await queue.now("test job", { lhs: 1, rhs: 2 });
    });
});

test("receive success event", (t) => {
    return new Promise(async (resolve) => {
        const queue = new Agenda({ db: { address: "mongodb://127.0.0.1/agenda" } });

        // noinspection JSCheckFunctionSignatures
        queue.define("test job", (job, done) => {
            // noinspection JSUnresolvedVariable
            t.is(1, job.attrs.data.lhs);
            // noinspection JSUnresolvedVariable
            t.is(2, job.attrs.data.rhs);

            done();
        });

        // noinspection JSUnresolvedFunction, JSUnusedLocalSymbols
        queue.on("success", (job) => {
            resolve();
        });

        await queue.start();

        // noinspection JSCheckFunctionSignatures
        await queue.now("test job", { lhs: 1, rhs: 2 });
    });
});
