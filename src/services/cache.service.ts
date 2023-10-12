import Redis from "ioredis";
import { formateData } from "../utils/formate-data";
import { FormateData } from "../custom-type";
export class CacheService {
  constructor(private readonly redis: Redis) {}

  getKey(pattern: string) {
    return this.redis.keys(pattern);
  }

  async setData(key: string, seconds: number, value: any) {
    return this.redis
      .setex(key, seconds, JSON.stringify(value))
      .then((res) => {
        console.log("Set Data in redis success");
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getData(key: string): Promise<FormateData> {
    const result = this.redis
      .get(key)
      .then((data) => {
        if (data === null) {
          return formateData(true, 200, "Data in redis is null", null);
        }
        return formateData(
          true,
          200,
          "Get data from redis success",
          JSON.parse(data)
        );
      })
      .catch((err) => {
        return formateData(false, 400, "Get data from redis success", null);
      });

    return result;
  }

  async deleteData(key: string) {
    return this.redis
      .del(key)
      .then((res) => {
        console.log("Delete data in redis success");
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
