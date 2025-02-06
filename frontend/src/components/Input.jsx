const Input = ({ icon: Icon, ...props }) => {
	return (
		<div className='form-control'>
			<label className='input input-bordered flex items-center gap-2'>
				{Icon && <Icon className='size-5 text-primary' />}
				<input {...props} className='grow' />
			</label>
		</div>
	);
};
export default Input;
