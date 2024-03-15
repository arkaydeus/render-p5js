import { FastifyInstance, FastifyRequest } from "fastify";
import p5 from "node-p5";
import { sketch } from "./squiggle";
import { getArblocksAssets, getTokenHash } from "./artblocks";

interface SquiggleRouteHash {
  hash: string;
}

interface SquiggleRouteId {
  id: string;
}

interface SquiggleQueryParams {
  height: string;
  width: string;
  red: string;
  green: string;
  blue: string;
  alpha: string;
}

const generateSquiggle = async (
  hash: string,
  height: string,
  width: string,
  red: string,
  green: string,
  blue: string,
  alpha: string
) => {
  console.log("Height: ", height);
  console.log("Width: ", width);

  const intRed = parseInt(red);
  const intGreen = parseInt(green);
  const intBlue = parseInt(blue);
  const intAlpha = parseInt(alpha);

  const imageData: string = await new Promise((resolve) => {
    p5.createSketch((p) =>
      sketch(p, resolve, [hash], height, width, [
        intRed,
        intGreen,
        intBlue,
        intAlpha,
      ])
    );
  });

  const imageBuffer = Buffer.from(imageData.split(",")[1], "base64");
  return imageBuffer;
};

export const squiggleRoutes = async (fastify: FastifyInstance, options) => {
  fastify.get<{
    Params: SquiggleRouteHash;
  }>("/hash/:hash", async (request, reply) => {
    if (!request.params.hash) {
      reply.code(400).send("Please provide a token hash");
      return;
    }

    if (request.params.hash.length !== 66) {
      reply.code(400).send("Invalid hash");
      return;
    }

    const {
      height,
      width,
      red = "255",
      green = "255",
      blue = "255",
      alpha = "0",
    } = request.query as SquiggleQueryParams;

    const imageBuffer = await generateSquiggle(
      request.params.hash,
      height,
      width,
      red,
      green,
      blue,
      alpha
    );

    reply
      .code(200)
      .headers({
        "Cache-Control": "public max-age=86400, s-maxage=86400",
        "Content-Type": "image/png",
      })
      .send(imageBuffer);
  });

  fastify.get<{
    Params: SquiggleRouteId;
  }>("/id/:id", async (request, reply) => {
    if (!request.params?.id) {
      reply.code(400).send("Invalid id");
      return;
    }

    if (isNaN(Number(request.params.id))) {
      reply.code(400).send("Invalid id");
      return;
    }

    const {
      height,
      width,
      red = "255",
      green = "255",
      blue = "255",
      alpha = "0",
    } = request.query as SquiggleQueryParams;

    const hash = await getTokenHash(request.params.id);

    const imageBuffer = await generateSquiggle(
      hash,
      height,
      width,
      red,
      green,
      blue,
      alpha
    );

    reply
      .code(200)
      .headers({
        "Cache-Control": "public max-age=86400, s-maxage=86400",
        "Content-Type": "image/png",
      })
      .send(imageBuffer);
  });
};
