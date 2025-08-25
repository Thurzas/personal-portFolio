//pour que typescript soit pas trop perdu avec les importation de glsl

declare module "*.glsl" {
  const value: string;
  export default value;
}
  