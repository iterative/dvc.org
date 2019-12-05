# Writing well-behaved commands

DVC is simple to use, you only need to wrap your commands with `dvc run`, and
define your dependencies and outputs.

To prevent unexpected behaviors, ideally, your commands should follow some
principles:

- Read exclusively from specified dependencies
- Write exclusively to specified outputs
- Completely rewrite the outputs (do not append)
- Stop reading and writing when the command exits
