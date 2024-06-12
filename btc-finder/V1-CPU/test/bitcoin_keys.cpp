#include <node.h>
#include <v8.h>
#include <bitcoin/bitcoin.hpp>

using namespace v8;

void GetBitcoinAddress(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    if (args.Length() < 1) {
        isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Wrong number of arguments")));
        return;
    }

    if (!args[0]->IsString()) {
        isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Wrong arguments")));
        return;
    }

    v8::String::Utf8Value param1(args[0]->ToString());
    std::string privateKeyHex = std::string(*param1);

    bc::ec_secret secret;
    bc::decode_base16(secret, privateKeyHex);
    bc::wallet::ec_private private_key(secret);
    bc::wallet::payment_address address(private_key.to_public());

    args.GetReturnValue().Set(String::NewFromUtf8(isolate, address.encoded().c_str()));
}

void Initialize(Local<Object> exports) {
    NODE_SET_METHOD(exports, "getBitcoinAddress", GetBitcoinAddress);
}

NODE_MODULE(bitcoin_keys, Initialize)
