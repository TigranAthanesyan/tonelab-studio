declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: import('mongoose') | null;
    promise: Promise<import('mongoose')> | null;
  };
} 