import { FastifyInstance, FastifyPluginOptions } from "fastify";
import p5 from "node-p5";
import { getTokenHash } from "./artblocks";
import { sketch } from "./squiggle";

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
  index?: string;
}

/**
 * Generate a Squiggle image buffer from a token hash and render options.
 */
const generateSquiggle = async (
  hash: string,
  height: string,
  width: string,
  red: string,
  green: string,
  blue: string,
  alpha: string,
  index: string
): Promise<Buffer> => {
  console.log("Height: ", height);
  console.log("Width: ", width);

  const intRed = parseInt(red);
  const intGreen = parseInt(green);
  const intBlue = parseInt(blue);
  const intAlpha = parseInt(alpha);
  const intIndex = Number.isNaN(parseInt(index)) ? 0 : parseInt(index);

  const imageData: string = await new Promise((resolve) => {
    p5.createSketch((p) =>
      sketch(
        p,
        resolve,
        [hash],
        height,
        width,
        [intRed, intGreen, intBlue, intAlpha],
        intIndex
      )
    );
  });

  const imageBuffer = Buffer.from(imageData.split(",")[1], "base64");
  return imageBuffer;
};

export const squiggleRoutes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> => {
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
      index = "0",
    } = request.query as SquiggleQueryParams;

    const imageBuffer = await generateSquiggle(
      request.params.hash,
      height,
      width,
      red,
      green,
      blue,
      alpha,
      index
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
      index = "0",
    } = request.query as SquiggleQueryParams;

    const hash = getTokenHash(request.params.id);

    if (!hash) {
      reply.code(404).send("Token hash not found");
      return;
    }

    const imageBuffer = await generateSquiggle(
      hash,
      height,
      width,
      red,
      green,
      blue,
      alpha,
      index
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
