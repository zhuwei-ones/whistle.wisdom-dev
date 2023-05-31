const {
  getEnvInfoFromUrl,
  getOriginalHostname,
  getApiCurrentPath,
  getCorrectUrlEntry,
  getEnvUrlReg,
  getCorrectTimezone
} = require("./getValue");

describe("Test getEnvInfoFromUrl", () => {
  test("Test Is Not Url", () => {
    const result = getEnvInfoFromUrl("2323345345345");

    expect(result).toEqual({
      lang: "",
      env: "",
      timezone: ""
    });
  });
  test("Test Empty Url", () => {
    const result = getEnvInfoFromUrl("");

    expect(result).toEqual({
      lang: "",
      env: "",
      timezone: ""
    });
  });

  test("Test No Env White Url", () => {
    const result = getEnvInfoFromUrl("dev.myones.net");

    expect(result).toEqual({
      lang: "",
      env: "",
      timezone: ""
    });
  });

  test("Test No Env Other Url", () => {
    const result = getEnvInfoFromUrl("baidu.com");

    expect(result).toEqual({
      lang: "",
      env: "",
      timezone: ""
    });
  });

  test("Test Only Lang Url", () => {
    const result = getEnvInfoFromUrl("http://en.dev.myones.net");

    expect(result).toEqual({
      lang: "en",
      env: "",
      timezone: ""
    });
  });

  test("Test Only Config Url", () => {
    const result = getEnvInfoFromUrl("http://com.dev.myones.net");

    expect(result).toEqual({
      lang: "",
      env: "com",
      timezone: ""
    });
  });

  test("Test Config & Lang Url", () => {
    const result = getEnvInfoFromUrl("http://en.com.dev.myones.net");

    expect(result).toEqual({
      lang: "en",
      env: "com",
      timezone: ""
    });
  });

  test("Test Is Not Url", () => {
    const result = getEnvInfoFromUrl("http://en.com.dev.myones.net");

    expect(result).toEqual({
      lang: "en",
      env: "com",
      timezone: ""
    });
  });

  test("Test Timezone Url", () => {
    const result = getEnvInfoFromUrl(
      "http://america__los_angeles.en.com.dev.myones.net"
    );

    expect(result).toEqual({
      lang: "en",
      env: "com",
      timezone: "America/Los_Angeles"
    });
  });
});

describe("Test getOriginalHostname", () => {
  test("Test Is Not Host", () => {
    const result = getOriginalHostname("2323345345345");
    expect(result).toBe("");
  });
  test("Test Empty Host", () => {
    const result = getOriginalHostname("");
    expect(result).toBe("");
  });
  test("Test No White Url", () => {
    const result = getOriginalHostname("http://baidu.com");
    expect(result).toBe("baidu.com");
  });
  test("Test White Url", () => {
    const result = getOriginalHostname("http://dev.myones.net");
    expect(result).toBe("dev.myones.net");
  });

  test("Test Only Lang Url", () => {
    const result = getOriginalHostname("http://en.dev.myones.net");
    expect(result).toEqual("dev.myones.net");
  });

  test("Test Only Config Url", () => {
    const result = getOriginalHostname("http://com.dev.myones.net");
    expect(result).toEqual("dev.myones.net");
  });

  test("Test Config & Lang Url", () => {
    const result = getOriginalHostname("http://en.com.dev.myones.net");
    expect(result).toEqual("dev.myones.net");
  });
});

describe("Test getApiCurrentPath", () => {
  const currentResult = "http://dev.myones.net/a/a/a/a";

  test("Test No Config Url", () => {
    expect(getApiCurrentPath("http://dev.myones.net/a/a/a/a")).toEqual(
      currentResult
    );
  });

  test("Test No Env White Url", () => {
    expect(getApiCurrentPath("http://baidu.com/a")).toEqual(
      "http://baidu.com/a"
    );
  });

  test("Test Only Lang Url", () => {
    expect(getApiCurrentPath("http://en.dev.myones.net/a/a/a/a")).toEqual(
      currentResult
    );
  });

  test("Test Only Config Url", () => {
    expect(getApiCurrentPath("http://com.dev.myones.net/a/a/a/a")).toEqual(
      currentResult
    );
  });

  test("Test Config & Lang Url", () => {
    expect(getApiCurrentPath("http://en.com.dev.myones.net/a/a/a/a")).toEqual(
      currentResult
    );
  });

  test("Test just host", () => {
    expect(getApiCurrentPath("http://en.com.dev.myones.net")).toEqual(
      "http://dev.myones.net"
    );
    expect(getApiCurrentPath("http://en.com.dev.myones.net/")).toEqual(
      "http://dev.myones.net/"
    );
  });
});

describe("Test getCorrectUrlEntry", () => {
  test("Test No Referer", () => {
    expect(
      getCorrectUrlEntry({
        headers: {
          referer: "",
          host: ""
        },
        originalReq: {
          url: "http://dev.myones.net/a/a/a"
        }
      })
    ).toEqual("http://dev.myones.net");
  });

  test("Test / Referer", () => {
    expect(
      getCorrectUrlEntry({
        headers: {
          referer: "/",
          host: "dev.myones.net"
        },
        originalReq: {
          url: "http://dev.myones.net/a/a/a"
        }
      })
    ).toEqual("http://dev.myones.net");
  });

  test("Test Correct Referer", () => {
    expect(
      getCorrectUrlEntry({
        headers: {
          referer: "http://preview.myones.net/",
          host: "dev.myones.net"
        },
        originalReq: {
          url: "http://dev.myones.net/a/a/a"
        }
      })
    ).toEqual("http://preview.myones.net/");
  });

  test("Test No Req Url", () => {
    expect(
      getCorrectUrlEntry({
        headers: {
          referer: "http://preview.myones.net/",
          host: "dev.myones.net"
        },
        originalReq: {
          url: ""
        }
      })
    ).toEqual("http://preview.myones.net/");
  });

  test("Test No Host", () => {
    expect(
      getCorrectUrlEntry({
        headers: {
          referer: "http://preview.myones.net/",
          host: ""
        },
        originalReq: {
          url: "http://dev.myones.net/a"
        }
      })
    ).toEqual("http://preview.myones.net/");
  });

  test("Test Correct Req Url", () => {
    expect(
      getCorrectUrlEntry({
        headers: {
          referer: "http://preview.myones.net/",
          host: ""
        },
        originalReq: {
          url: "http://zh.dev.myones.net/a"
        }
      })
    ).toEqual("http://zh.dev.myones.net");
  });

  test("Test Correct Referer", () => {
    expect(
      getCorrectUrlEntry({
        headers: {
          referer: "http://zh.dev.myones.net/",
          host: ""
        },
        originalReq: {
          url: "http://dev.myones.net/a"
        }
      })
    ).toEqual("http://zh.dev.myones.net/");
  });
});

describe("Test getEnvHostnameReg", () => {
  test("Test No Referer", () => {
    expect(getEnvUrlReg()).toEqual(
      "(https?):\\/\\/((\\w+?__\\w+?)\\.)?((zh|ja|en)\\.)?((cn|com|cnp|comp)\\.)?(.+)"
    );
  });
});

describe("Test getCorrectTimezone", () => {
  test("Test No timezone", () => {
    expect(getCorrectTimezone()).toEqual("");
  });
  test("Test timezone", () => {
    expect(getCorrectTimezone("america__los_angeles")).toEqual(
      "America/Los_Angeles"
    );
  });
});
