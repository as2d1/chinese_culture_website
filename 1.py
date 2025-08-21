import os
from openai import OpenAI
import openai


client = OpenAI(
    # x1
    api_key="AOpbScLsimTVQCgvlbnT:iSyNPqncMPiYcHLJWzso",  # 两种方式：1、http协议的APIpassword； 2、ws协议的apikey和apisecret 按照ak:sk格式拼接；
    base_url="https://spark-api-open.xf-yun.com/v2",
)

# stream_res = True
stream_res = False


stream = client.chat.completions.create(
    messages=[
          {
            "role": "user",
            "content": "你好"
        },

    ],

    model="x1",
    stream=stream_res,
    user="123456",

)
full_response = ""

if not stream_res:
    print(stream.to_json())
else:
    for chunk in stream:
        if hasattr(chunk.choices[0].delta, 'reasoning_content') and chunk.choices[0].delta.reasoning_content is not None:
            reasoning_content = chunk.choices[0].delta.reasoning_content
            print(reasoning_content, end="", flush=True)  # 实时打印思考模型输出的思考过程每个片段
        
        if hasattr(chunk.choices[0].delta, 'content') and chunk.choices[0].delta.content is not None:
            content = chunk.choices[0].delta.content
            print(content, end="", flush=True)  # 实时打印每个片段
            full_response += content
    
    print("\n\n ------完整响应：", full_response)   