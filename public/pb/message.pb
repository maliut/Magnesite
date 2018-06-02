syntax = "proto3";

message Vector3 {
    double x = 1;
    double y = 2;
    double z = 3;
}

message AvatarState {
    Vector3 position = 1;
    Vector3 velocity = 2;
    uint32 timestamp = 3;
}