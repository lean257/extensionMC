async function getControlsResponse() {
  return {
    controls: [
      {
        boolean: {
          name: 'show_rating',
          label: 'Show Rating',
          description: 'Showing business rating',
          default: true,
        },
      },
      {
        enum: {
          name: 'enum',
          label: 'Enum',
          options: [
            {
              label: 'Option 1',
              value: 'option1',
            },
            {
              label: 'Option 2',
              value: 'option2',
            },
          ],
          default: 'option1',
          description: 'A small set of pre-defined options.',
        },
      },
    ],
  }
}

exports.getControlsResponse = getControlsResponse;