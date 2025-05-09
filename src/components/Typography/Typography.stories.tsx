import Typography from '.'

const Examples = () => {
  return (
    <>
      <Typography variant="h1">h1. Heading</Typography>
      <Typography variant="h2">h2. Heading</Typography>
      <Typography variant="h3">h3. Heading</Typography>
      <Typography variant="h4">h4. Heading</Typography>

      <Typography variant="subtitle" size="large">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae
        elit libero, a pharetra augue. Donec id elit non mi porta gravida at
        eget metus.
      </Typography>

      <Typography variant="subtitle" size="medium">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae
        elit libero, a pharetra augue. Donec id elit non mi porta gravida at
        eget metus.
      </Typography>

      <Typography variant="subtitle" size="small">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae
        elit libero, a pharetra augue. Donec id elit non mi porta gravida at
        eget metus.
      </Typography>

      <Typography variant="body" size="large">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae
        elit libero, a pharetra augue. Donec id elit non mi porta gravida at
        eget metus.
      </Typography>

      <Typography variant="body" size="medium">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae
        elit libero, a pharetra augue. Donec id elit non mi porta gravida at
        eget metus.
      </Typography>

      <Typography variant="body" size="small">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae
        elit libero, a pharetra augue. Donec id elit non mi porta gravida at
        eget metus.
      </Typography>

      <Typography variant="p">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae
        elit libero, a pharetra augue. Donec id elit non mi porta gravida at
        eget metus.
      </Typography>

      <Typography variant="h2">
        Build your model registry on top of Git
      </Typography>
      <Typography
        variant="subtitle"
        size="large"
        className="max-w-3xl text-center"
      >
        Reuse existing Git infrastructure for managing ML models together with
        code, data and metrics. With git as your single source of truth, use
        GitOps for model deployment.
      </Typography>
      <Typography variant="body">
        Manage the lifecycle of each model as it moves through staging,
        production and other stages. See at a glance which model versions are in
        which stage.{` `}
        <Typography variant="span">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae
          elit libero, a pharetra augue. Donec id elit non mi porta gravida at
          eget metus.
        </Typography>
      </Typography>
    </>
  )
}

export default Examples
